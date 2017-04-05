#!/bin/bash

mkdir -p package/rpms

rpmbuild -ba package/package.spec \
         --target x86_64-redhat-linux \
         --define "_sourcedir `pwd`" \
         --define "_rpmdir `pwd`/package/rpms"
