SHELL := /bin/bash
PATH  := $(PATH):./node_modules/.bin
LESSC := lessc --strict-math=on
ROLLUP := rollup -c .rollup.config.js

LESS_FILES := $(shell find less -name "*.less")
JS_FILES := $(shell find js -name "*.js")

.PHONY: all clean

all: public/css/app.css public/js/app.js

clean:
	rm -rf public/css public/js

public/css/app.css: $(LESS_FILES)
	mkdir -p $(@D)
	$(LESSC) less/app.less > $@

public/js/app.js: $(JS_FILES)
	@mkdir -p $(@D)
	$(ROLLUP) -o $@ js/app.js

public/js/sw.js: $(JS_FILES)
	@mkdir -p $(@D)
	$(ROLLUP) -o $@ js/sw.js
