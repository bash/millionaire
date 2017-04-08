export const templateFile = (name) => `/templates/${window.templateMap[name] || name}.html`
export const fetchTemplate = (name) => window.fetch(templateFile(name)).then((resp) => resp.text())
