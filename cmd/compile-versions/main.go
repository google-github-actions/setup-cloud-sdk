package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/signal"
	"regexp"
	"sort"
	"syscall"

	"cloud.google.com/go/storage"
	"github.com/maruel/natural"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

var versionRe = regexp.MustCompile(`.*-(\d+\.\d+\.\d+).*`)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(),
		syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	if err := realMain(ctx); err != nil {
		cancel()
		fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(2)
	}
}

func realMain(ctx context.Context) error {
	client, err := storage.NewClient(ctx, option.WithoutAuthentication())
	if err != nil {
		return fmt.Errorf("failed to create storage client: %w", err)
	}

	// Do server-side filtering to only return the linux builds and "Name"
	// attribute. This dramatically reduces the response size and number of
	// entries we need to process.
	//
	// At some point, the naming scheme changed, so we can't filter by a full glob
	// or prefix.
	var q storage.Query
	q.MatchGlob = "*-linux-x86_64.tar.gz"
	if err := q.SetAttrSelection([]string{"Name"}); err != nil {
		return fmt.Errorf("failed to set attribute selection: %w", err)
	}

	var names []string
	it := client.Bucket("cloud-sdk-release").Objects(ctx, &q)
	for {
		attrs, err := it.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return fmt.Errorf("failed to get object: %w", err)
		}
		names = append(names, attrs.Name)
	}

	// De-duplicate. Even with just selecting linux, there are some duplicate
	// versions.
	versionsMap := make(map[string]struct{}, len(names))
	for _, name := range names {
		sub := versionRe.FindStringSubmatch(name)
		if sub == nil || len(sub) < 2 {
			// no match
			continue
		}

		versionsMap[sub[1]] = struct{}{}
	}

	// Do a natural sort so that it looks good to humans instead of machines.
	versions := make([]string, 0, len(versionsMap))
	for version := range versionsMap {
		versions = append(versions, version)
	}
	sort.Sort(natural.StringSlice(versions))

	// Print it out.
	b, err := json.MarshalIndent(versions, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to create json: %w", err)
	}
	fmt.Fprintln(os.Stdout, string(b))

	return nil
}
