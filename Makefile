.PHONY: usage


VERSION := $(shell jq -r .version < manifest.json)
PACKAGE := $(shell jq -r .name < manifest.json)

usage:
	@echo "No targets selected"

package_firefox:
	zip -r -FS "../$(PACKAGE)-$(VERSION).zip" * --exclude '*.git*' --exclude "Makefile" --exclude "README.md"
