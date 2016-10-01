# recalbox-manager
A web interface to manage recalbox configuration

## Installation
1. Clone or download the repository: `git clone https://github.com/DjLeChuck/recalbox-manager.git`
2. Install all the requirements from a computer (not recalbox): `npm install`
3. Copy the folder on recalbox : `\recalbox\share\manager` for example
4. Activate the API: https://github.com/recalbox/recalbox-api/blob/1.1.x/documentation/activate-on-recalbox.md
5. Launch the server (connect through SSH on the recalbox): `cd /recalbox/share/manager && node app.js`
6. Go on http://recalbox:3000/
