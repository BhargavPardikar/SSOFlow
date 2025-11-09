export const wordPressidpSelectors = {
    continue : '.pds-button', 
    username : '#user_login',
    password : '#user_pass',
    submit : '#wp-submit' , 
    oauthplugin : '#toplevel_page_mo_oauth_server_settings div.wp-menu-name' ,
    configureapp : 'a.miniorange-oauth-20-server-orange-color' , 
    redirecturl : 'input[name="redirect_uri"]' , 
    update:  'button[name="update_client_button"][value="update_client_app"]' , 
    clientid : ('tr', 'Client ID:'), 
    clientsectret : ('tr', 'Client Secret:' ), 
    authoeisationendpoint :  ('tr', 'Authorization Endpoint:'), 
    tokenendpoint : ('tr', 'Token Endpoint:') , 
    userinfo : (/(Userinfo Endpoint:|Get User Info Endpoint:)/i) , 
    scopes : ('tr', 'Scopes:') ,
    endpointCell: 'td.endpoint', 
    clientSecretInput: 'input#client-secret'
};     