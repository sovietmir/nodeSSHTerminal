A simple implementation of SSH terminal using node.js. This script is useful to masquerade in command line interface the session to some ssh terminal. 
When using the common cli command ssh, one can see in the process list the command itself along with the host connection was made to and optionalu the login username. 
This script promts for host, username and password. Then it establishes TTY session. In process list only the node command is shown, without host or login username.

To use simply run 
node secureShell.js

To install 
npm install 
