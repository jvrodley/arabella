--
-- Table structure for table user
--

CREATE TABLE "need"
(
    needid                serial primary key,
    original_github_url   VARCHAR(1024) NOT NULL,
    original_github_owner VARCHAR(1024) NOT NULL,
    description           VARCHAR(2048) NOT NULL,
    target_os_name        VARCHAR(256)   NULL,
    target_os_version     VARCHAR(100)   NULL,
    target_name1          VARCHAR(256)   NULL,
    target_version1       VARCHAR(100)   NULL,
    target_name2          VARCHAR(256)   NULL,
    target_version2       VARCHAR(100)   NULL,
    discord_channel_name    VARCHAR(256) NULL,
    languages   VARCHAR(1024) NULL
);

CREATE TABLE "user" (
                        userid serial primary key,
                        firstname varchar(20) NOT NULL,
                        lastname varchar(20) NOT NULL,
                        email varchar(100) NOT NULL,
                        username varchar(100) DEFAULT NULL
);

CREATE TABLE "claim" (
                         claimid serial primary key,
                         needid_need           int       NOT NULL,
                         userid_User           int       NOT NULL,
                         forked_github_url     VARCHAR(1024) NOT NULL,
                         forked_github_owner   VARCHAR(1024) NOT NULL,
                         FOREIGN KEY (userid_User) REFERENCES "user" (userid),
                         FOREIGN KEY (needid_need) REFERENCES "need" (needid)
);

