<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */
 
// Include local configuration
if (file_exists(dirname(__FILE__) . '/local-config.php')) {
	include(dirname(__FILE__) . '/local-config.php');
}

// Global DB config
if (!defined('DB_NAME')) {
	define('DB_NAME', 'mapteste_leaflet');
}
if (!defined('DB_USER')) {
	define('DB_USER', 'mapteste_leaflet');
}
if (!defined('DB_PASSWORD')) {
	define('DB_PASSWORD', 'cr1m3&pun15hm3nt');
}
if (!defined('DB_HOST')) {
	define('DB_HOST', '10.169.0.29');
}

/** Database Charset to use in creating database tables. */
if (!defined('DB_CHARSET')) {
	define('DB_CHARSET', 'utf8');
}

/** The Database Collate type. Don't change this if in doubt. */
if (!defined('DB_COLLATE')) {
	define('DB_COLLATE', '');
}

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'F-q88H{g=_5l`N(Z Fw1XH-C;*Ob;D-xWY^CluPom2!zzFvD+|ol:?2Tps>+-W ?');
define('SECURE_AUTH_KEY',  '::;3|~{j]nd^)=|l&aM[CPUI9uGojp~5/?}$M#=lM671(FaUU?*:M_3L~F 2g|!M');
define('LOGGED_IN_KEY',    'QierW%)SzXSvRF54=`Q1Z45S=LVu7yfWU.%^ufoCqS*oz*7DUi+9a%6R@LS2YNr/');
define('NONCE_KEY',        'NpvN] Q!uG7&U+/]Mb0!f-KzT[-+j{s)hp+P`-o<Y@E=^n@@FoM*M|6$=:-J:7P#');
define('AUTH_SALT',        'I;bOzW5O*CXt+c;vXz9+iMyR/+(2lE#2_ZeP<3I:#x/m+@;ryXfz:rL;9a2R+jaI');
define('SECURE_AUTH_SALT', '0N>`US(L_-F33*jJjO3mrON}QQKR9 jqy$,cQ@Z0Ve-Spb(:3s.F$dGU&g_rjmQ(');
define('LOGGED_IN_SALT',   'C4Q9X/wa[Y3V$hrL| vpU[*J*,_sq-~PJ}TR_|/M[77y#qmN?RHz=B+-C^~*M)>n');
define('NONCE_SALT',       'y65*Tp+}Vd%gJ46o.ph=(y/xp!EK98TMk+]+=~p!4V-6r:,K$r]y-$@Sh-|[:c?J');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'p1z_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');


/**
 * Set custom paths
 *
 * These are required because wordpress is installed in a subdirectory.
 */
if (!defined('WP_SITEURL')) {
	define('WP_SITEURL', 'http://' . $_SERVER['SERVER_NAME'] . '/wordpress');
}
if (!defined('WP_HOME')) {
	define('WP_HOME',    'http://' . $_SERVER['SERVER_NAME'] . '');
}
if (!defined('WP_CONTENT_DIR')) {
	define('WP_CONTENT_DIR', dirname(__FILE__) . '/content');
}
if (!defined('WP_CONTENT_URL')) {
	define('WP_CONTENT_URL', 'http://' . $_SERVER['SERVER_NAME'] . '/content');
}


/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
if (!defined('WP_DEBUG')) {
	define('WP_DEBUG', false);
}

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
