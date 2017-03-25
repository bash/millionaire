Name: millionaire
Version: 0.1.0
Release: 1
Summary: Millionaire
License: AGPL
BuildArch: noarch

%description
Millionaire

%build
cp -R ${RPM_SOURCE_DIR}/src ${RPM_BUILD_DIR}
cp ${RPM_SOURCE_DIR}/Cargo.toml ${RPM_BUILD_DIR}/
cp ${RPM_SOURCE_DIR}/Cargo.lock ${RPM_BUILD_DIR}/

cargo build --release

%clean
rm -rf ${RPM_BUILD_DIR}/*
