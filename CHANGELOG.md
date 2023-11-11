CHANGELOG
0.5.0 - add API token authentication so users can use JWT or API token. Query database for specific pgroup entries with optional before and after arguments.

0.4.3 - heidi logo dimensions fixed to 200x200px, data processing tables shown only when complete, errors shown

0.4.2 - crystal details did not show if fast processing failed. Fixed so it shows when full processing is successful. 

0.4.1 - typo, duplicate unique reflections column. Fixed observed reflections. 

0.4.0 - data processing module added with e-account selection
      - live streaming of data processing results
      - sample camera image added per dataset collection
      - ability to copy path to raw and processed data at SLS
      - link to beamline calendars and data transfer services added to Docs
      - NGINX reverse proxy configured for all microservices to provide HTTPS

0.3.2 - add link to shipping guidelines and instructions

0.2.2 - udpate spreadsheet documentation file and add link to heidi survey

0.2.1 - bug fix for loading button when spreadsheet is not valid

0.2.0 - download pdf instructions
- include link to mx-software documentation on PSI website
- message to user when they provide incorrect credentials

0.1.1 - add more file types to pre-cache manifest

0.1.0 - app available from heidi-test.psi.ch
- added spreadsheet download of TELL template file

0.0.4 - did not work with F5 reverse proxy from outside of PSI
- Sem created dedicated F5 instance heidi-test.psi.ch
- Spreadsheet download feature flag implemented

0.0.3 - works with F5 reverse proxy and load balancer - rp.psi.ch
- service worker registration successful

0.0.2 - works on mx-webapps.psi.ch inside VPN
- addition of loading button for spreadsheet
- bug fix for dewar count (convert list to set and then get value)
- feature flag configuration to quickly deploy/revert features in production

0.0.1 - initial alpha testing
- vue3, pinia, bootstrap, vue-router
- port original application functionality
