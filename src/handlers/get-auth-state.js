/**
 *
 * @returns {function(*)}
 */
module.exports = function () {
  return (ctx) => {
    const adminId = ctx.session.adminId

    ctx.body = {
      authenticated: (adminId != null),
      admin_id: adminId
    }
  }
}
