#!/bin/bash

mkdir -p package/rpms

rpmbuild -ba package/package.spec \
         --define "_sourcedir `pwd`" \
         --define "_rpmdir `pwd`/package/rpms"
