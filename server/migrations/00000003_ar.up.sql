ALTER TABLE "user" ADD COLUMN avatar_url VARCHAR(1024);
ALTER TABLE "need" ADD COLUMN original_github_description VARCHAR(1024);

INSERT INTO "user" (firstname, lastname, email, username, avatar_url)
VALUES ('John','Rodley','john@rodley.com','john@rodley.com', '//s.gravatar.com/avatar/87ae97e972bdae9122c58ed4853ff472?s=80');

INSERT INTO "need" (original_github_url,
                    original_github_owner,
                    original_github_description,
                    description,
                    target_os_name,
                    target_os_version,
                    target_name1,
                    target_version1,
                    languages)
VALUES('laramies/theHarvester', 'laramies',
       'theHarvester is a simple to use, yet powerful tool designed to be used during the reconnaissance stage of a red team assessment or penetration test',
       'Needs a Windows UI that limits arguments to small subset - see Discord discussion',
       'Windows', '10', 'Python','3','Python, Dockerfile');

INSERT INTO "need" (original_github_url,
                    original_github_owner,
                    original_github_description,
                    description,
                    target_os_name,
                    target_os_version,
                    target_name1,
                    target_version1,
                    languages)
VALUES('Datalux/Osintgram', 'Datalux',
       'Osintgram is a OSINT tool on Instagram to collect, analyze, and run reconnaissance.',
       'Work with Python 3.9 on Windows 7',
       'Windows', '7', 'Python','3.9','Python, Makefile, Dockerfile');

INSERT INTO "need" (original_github_url,
                    original_github_owner,
                    original_github_description,
                    description,
                    target_os_name,
                    target_os_version,
                    target_name1,
                    target_version1,
                    languages)
VALUES('s0md3v/Photon', 's0md3v',
       'Incredibly fast crawler designed for OSINT',
       'Broken - needs to work with Python 3.7 on Mac',
       'MacOS', 'High Sierra', 'Python','3.7','Python, Dockerfile');

INSERT INTO "need" (original_github_url,
                    original_github_owner,
                    original_github_description,
                    description,
                    target_os_name,
                    target_os_version,
                    target_name1,
                    target_version1,
                    languages)
VALUES('DedSecInside/TorBot', 'DedSecInside',
       'Incredibly fast crawler designed for OSINT',
       'Broken - won''t build/run in Debian, Mac or Windows',
       'Debian', 'Buster', 'Python','3','Python, Shell, Dockerfile');

