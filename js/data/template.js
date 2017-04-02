export const templateFile = (name) => `/templates/${name}.html`
export const fetchTemplate = (name) => fetch(templateFile(name)).then((resp) => resp.text())
