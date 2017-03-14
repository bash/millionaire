SHELL := /bin/bash
PATH  := $(PATH):./node_modules/.bin
CARGO := cargo
LESSC := lessc

ifndef BUILD_MODE
BUILD_MODE = debug
endif

RUST_FILES := $(shell find src -name "*.rs")
LESS_FILES := $(shell find less -name "*.less")
JS_FILES := $(shell find js -name "*.js")

.PHONY: all binary

all: target/$(BUILD_MODE)/millionaire public/css/app.css public/js/app.js

target/$(BUILD_MODE)/millionaire: $(RUST_FILES)
ifeq ($(BUILD_MODE), release)
	$(CARGO) build --release
else
	$(CARGO) build
endif

public/css/app.css: $(LESS_FILES)
	mkdir -p $(@D)
	$(LESSC) --strict-math=on less/app.less > $@

public/js/app.js: $(JS_FILES)
	@mkdir -p $(@D)
	rollup -c .rollup.config.js -o $@ js/app.js
