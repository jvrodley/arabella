
# Project name - Arabella

[https://arabella.rodley.com:3000]()

## Team Members
John Rodley

## Tool Description
Arabella is a system for matching what investigators need from FOSS
tools on GitHub to technical resources in the OSINT community that can work on those tools.  
Investigators propose a change/update to a FOSS project, technical contributors pick projects from the list of
needs and upgrade a forked version of the FOSS project to meet the need.

For more detail, please see the pdf file here [https://github.com/jvrodley/arabella/blob/main/Arabella%20Proposal.pdf](https://github.com/jvrodley/arabella/blob/main/Arabella%20Proposal.pdf)

## Installation
This section includes detailed instructions for installing the tool, including any terminal commands that need to be executed and dependencies that need to be installed. Instructions should be understandable by non-technical users (e.g. someone who knows how to open a terminal and run commands, but isn't necessarily a programmer), for example:

1. This is not an easy or quick installation.  In fact, it is impractical for all intents and purposes as it requires secure tokens, keys and ssl certs.  The discord and github integrations require them.

2. Download the tool's repository using the command:

        git clone https://github.com/jvrodley/arabella.git

3. Move to the tool's directory and install the tool

        cd arabella
        cd server
        # Make a .env file containing github token, discord token, discord public key, discord guild id
        mkdir sslcert
        # copy your ssl certs into the sslcert directory
        mkdir client
        npm install
        cd ../ui
        npm install
        npm run build
        mv build ../server/client
        cd ../server
        node secure_app


## Usage
The systems user interface contains only three screens, Needs, Claims and Claim confirmation.
Needs are entered by an investigator using the /a3 command in the Arabella Discord server.
Needs are "claimed" for fixing by a fixer using the Needs screen claim button.  A claimed
project will lead to the Claim confirmation screen.
Projects that have been claimed by a fixer appear in the My Projects screen.

## Additional Information
This is development workflow automation tuned for the OSINT community.  We initiate the workflow from Discord because
that's where these needs are identified and the drivers of this process (bcat) live there.  We store only the information we need
to run in a 3 table postgresql database.  

Demo Script and what we didn’t show (i.e. doesn't work yet)

Create a Need by using a slash command form in a discord channel (DEMO’d)
*	Show new need-specific Discord channel (DEMO’d)
*	Show Needer’s invite to new need-specific Discord channel (DEMO’d)
*	Show new Need on Arabella’s home page (DEMO’d)
Create a Fix by pushing a button on the Fixer home page (DEMO’d)

*	Show Fixer’s invite to need-specific Discord channel (DEMO’d)
*	Show Needer’s notification of fix-in-progress NOT DONE
*	Show new Github project in Arabella account with main, develop and fix branches (FAKED BRANCH CREATION)
*	Show Fixer’s invitation to collaborate on GitHub project (NOT DONE)

Clone the new Arabella project locally, make a change, commit the change to fix-branch, create a PR to develop.
Accept the PR-to-develop in GitHub

*	Show one automated security check run against an isolated clone of the develop branch (NOT DONE)
*	Show automated PR-to-main (DEMO’d)

Accept the PR-to-main in GitHub

*	** Show email notification to Investigator-watchers (NOT DONE)
*	Show Discord message to need-specific channel (NOT DONE)
*	Show PR back to originating project on GitHub (NOT DONE)
*	** Show update of Arabella front page

The Pull Request automation worked for a hard-wired project-name but we ran out of time to parameterize.  In the same vein, even with
the other tricky Discord stuff we did, we didn't manage to post a message to a channel - go figure.