Name: millionaire
Version: 0.1.11
Release: 1
Summary: Millionaire
License: AGPL
BuildArch: noarch
Group: Applications/Internet
Prefix: /usr
Depends: make automake gcc gcc-c++

%description
Millionaire

%build
rm -rf $PWD
mkdir -p $PWD
cd $PWD

cp -R %{_sourcedir}/scripts ./scripts
cp -R %{_sourcedir}/data ./data
cp -R %{_sourcedir}/js ./js
cp -R %{_sourcedir}/less ./less
cp -R %{_sourcedir}/public ./public
cp -R %{_sourcedir}/src ./src
cp %{_sourcedir}/.babelrc ./.babelrc
cp %{_sourcedir}/.rollup.config.js ./.rollup.config.js
cp %{_sourcedir}/browserslist ./browserslist
cp %{_sourcedir}/Makefile ./Makefile
cp %{_sourcedir}/package.json ./package.json

npm install
make clean
BUILD_MODE=release make
./scripts/version-files.sh
npm prune --production
npm prune
npm shrinkwrap

%install
install -m 755 -d $RPM_BUILD_ROOT/usr/src/millionaire
install -m 755 -d $RPM_BUILD_ROOT/etc/systemd/system
install -m 755 -d $RPM_BUILD_ROOT/usr/share/millionaire
install -m 755 -d $RPM_BUILD_ROOT/usr/share/nginx/html/millionaire

cp -R ./src $RPM_BUILD_ROOT/usr/src/millionaire/src
cp -R ./package.json $RPM_BUILD_ROOT/usr/src/millionaire/package.json
cp -R ./npm-shrinkwrap.json $RPM_BUILD_ROOT/usr/src/millionaire/npm-shrinkwrap.json
cp %{_sourcedir}/package/units/millionaire.service $RPM_BUILD_ROOT/etc/systemd/system/
cp -R %{_sourcedir}/data $RPM_BUILD_ROOT/usr/share/millionaire/data
cp -R ./public/* $RPM_BUILD_ROOT/usr/share/nginx/html/millionaire/

%post
cd /usr/src/millionaire
PATH="$PATH:/usr/local/bin" NODE_ENV=production /usr/local/bin/npm install

%files
%defattr(-,root,root)
/usr/src/millionaire/*
/etc/systemd/system/millionaire.service
/usr/share/millionaire/*
/usr/share/nginx/html/millionaire/*
