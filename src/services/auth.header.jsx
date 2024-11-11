export function authHeader() {
  // const user = { token :'eyJhbGciOiJIUzI1NiJ9.eyJpc0FkbWluIjp0cnVlLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcyOTgzNjQ1MCwiZXhwIjoxNzMwNTM2NDUwfQ.rILdlPEvI3-e2cDlPEfs7oNz5Pp0lDHulf-oTalqP6U', username : 'admin'}
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user:'+user);
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token,username:user.username };
  } else {

    return {};
  }
}
