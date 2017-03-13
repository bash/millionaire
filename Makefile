CARGO = cargo
SHELL = /bin/bash

ifndef BUILD_MODE
BUILD_MODE = debug
endif

RUST_FILES := $(shell find src -name "*.rs")

.PHONY: all binary

all: target/$(BUILD_MODE)/millionaire

target/$(BUILD_MODE)/millionaire: $(RUST_FILES)
ifeq ($(BUILD_MODE), release)
	cargo build --release
else
	cargo build
endif

