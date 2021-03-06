use sageori_db;

/* 회원관리 */
DROP TABLE IF EXISTS TB_MEMBERS;
CREATE TABLE TB_MEMBERS (
    MEMBER_ID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(20) NOT NULL,
    HP VARCHAR(13) NOT NULL,
    CREATED_DATE DATETIME NOT NULL,
    DELETED CHAR(1) NOT NULL DEFAULT 'N'
) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

/* 기계번호 테이블 */
DROP TABLE IF EXISTS TB_MACHINE;
CREATE TABLE TB_MACHINE (
    MACHINE_ID INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY
) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

/* 지급관리 */
DROP TABLE IF EXISTS TB_PUBLISHES;
CREATE TABLE TB_PUBLISHES (
    PUBLISH_ID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    MACHINE_ID INTEGER NOT NULL,
    MEMBER_ID INTEGER NOT NULL,
    CREDIT INTEGER NOT NULL,
    BANK INTEGER NOT NULL,
    IMAGE_FILE VARCHAR(200),
    CREATED_DATE DATETIME NOT NULL,
    DELETED CHAR(1) NOT NULL DEFAULT 'N'
) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

/* 회수관리 */
DROP TABLE IF EXISTS TB_RETURN;
CREATE TABLE TB_RETURN (
    RETURN_ID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    MACHINE_ID1 INTEGER NOT NULL,
    MACHINE_ID2 INTEGER NOT NULL,
    MEMBER_ID INTEGER NOT NULL,
    RETURN_POINT INTEGER NOT NULL,
    SERVICE INTEGER NOT NULL,
    ONE_P_ONE INTEGER NOT NULL,
    IMAGE_FILE1 VARCHAR(200),
    IMAGE_FILE2 VARCHAR(200),
    CREATED_DATE DATETIME NOT NULL,
    DELETED CHAR(1) NOT NULL DEFAULT 'N'
) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

/* 차감 테이블 */
DROP TABLE IF EXISTS TB_EXCHANGE;
CREATE TABLE TB_EXCHANGE (
    EXCHANGE_ID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    MEMBER_ID INTEGER NOT NULL,
    EXCHANGE INTEGER NOT NULL,
    CREATED_DATE DATETIME NOT NULL,
    DELETED CHAR(1) NOT NULL DEFAULT 'N'
) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

/* User 테이블 */
DROP TABLE IF EXISTS TB_USERS;
CREATE TABLE TB_USERS (
    USER_ID VARCHAR(100) NOT NULL PRIMARY KEY,
    USER_PASSWORD VARCHAR(100) NOT NULL,
    CREATED_DATE DATETIME NOT NULL,
    DELETED CHAR(1) NOT NULL DEFAULT 'N'
) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;
