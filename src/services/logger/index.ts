/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
import * as Sentry from '@sentry/react-native';
import { SeverityLevel } from '@sentry/types';
import { DebugContext } from '@/services/logger/debugContext';
import { push } from '@/services/logger/logDump';

const IS_DEV = process.env.IS_DEV;
const LOG_LEVEL = process.env.LOG_LEVEL;

export enum LogLevel {
	Debug = 'debug',
	Info = 'info',
	Log = 'log',
	Warn = 'warn',
	Error = 'error',
	Fatal = 'fatal',
}

type Transport = (level: LogLevel, message: string | ErrorLog, metadata: Metadata) => void;

/**
 * A union of some of Sentry's breadcrumb properties as well as Sentry's
 * `captureException` parameter, `CaptureContext`.
 */
type Metadata = {
	/**
	 * Applied as Sentry breadcrumb types. Defaults to `default`.
	 *
	 * @see https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/#breadcrumb-types
	 */
	type?: 'default' | 'debug' | 'error' | 'navigation' | 'http' | 'info' | 'query' | 'transaction' | 'ui' | 'user';

	/**
	 * Passed through to `Sentry.captureException`
	 *
	 * @see https://github.com/getsentry/sentry-javascript/blob/903addf9a1a1534a6cb2ba3143654b918a86f6dd/packages/types/src/misc.ts#L65
	 */
	tags?: {
		[key: string]: number | string | boolean | bigint | symbol | null | undefined;
	};

	/**
	 * Any additional data, passed through to Sentry as `extra` param on
	 * exceptions, or the `data` param on breadcrumbs.
	 */
	[key: string]: unknown;
} & Parameters<typeof Sentry.captureException>[1];

const enabledLogLevels: {
	[key in LogLevel]: LogLevel[];
} = {
	[LogLevel.Debug]: [LogLevel.Debug, LogLevel.Info, LogLevel.Log, LogLevel.Warn, LogLevel.Error],
	[LogLevel.Info]: [LogLevel.Info, LogLevel.Log, LogLevel.Warn, LogLevel.Error],
	[LogLevel.Log]: [LogLevel.Log, LogLevel.Warn, LogLevel.Error],
	[LogLevel.Warn]: [LogLevel.Warn, LogLevel.Error],
	[LogLevel.Error]: [LogLevel.Error],
	[LogLevel.Fatal]: [LogLevel.Fatal],
};

/**
 * Color handling copied from Kleur
 *
 * @see https://github.com/lukeed/kleur/blob/fa3454483899ddab550d08c18c028e6db1aab0e5/colors.mjs#L13
 */
const colors: {
	[key: string]: [number, number];
} = {
	default: [0, 0],
	green: [32, 39],
	magenta: [35, 39],
	red: [31, 39],
	yellow: [33, 39],
};

function withColor([x, y]: [number, number]) {
	const rgx = new RegExp(`\\x1b\\[${y}m`, 'g');
	const open = `\x1b[${x}m`;
	const close = `\x1b[${y}m`;

	// eslint-disable-next-line func-names
	return function (txt: string) {
		if (txt == null) return txt;

		// eslint-disable-next-line no-bitwise
		return open + (~`${txt}`.indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
	};
}

/**
 * Used in dev mode to nicely log to the console
 */
export const consoleTransport: Transport = (level, message, metadata) => {
	const timestamp = new Date().toISOString();
	const extra = Object.keys(metadata).length ? ` ${JSON.stringify(metadata, null, '  ')}` : '';
	const color = {
		[LogLevel.Debug]: colors.magenta,
		[LogLevel.Info]: colors.default,
		[LogLevel.Log]: colors.default,
		[LogLevel.Warn]: colors.yellow,
		[LogLevel.Error]: colors.red,
		[LogLevel.Fatal]: colors.red,
	}[level];
	// needed for stacktrace formatting
	const log = level === LogLevel.Error ? console.error : console.log;

	push({ timestamp, level, message, metadata });

	log(`${timestamp} ${withColor(color)(`[${level.toUpperCase()}]`)} ${JSON.stringify(message)}${extra}`);
};

export const sentryTransport: Transport = (level: LogLevel, message, { type, tags, ...metadata }) => {
	const severityMap: { [key in LogLevel]: SeverityLevel } = {
		[LogLevel.Debug]: 'debug',
		[LogLevel.Info]: 'info',
		[LogLevel.Log]: 'log',
		[LogLevel.Warn]: 'warning',
		[LogLevel.Error]: 'error',
		[LogLevel.Fatal]: 'fatal',
	};

	const severity = severityMap[level];

	/**
	 * If a string, report a breadcrumb
	 */
	if (typeof message === 'string') {
		Sentry.addBreadcrumb({
			message,
			data: metadata,
			type: type || 'default',
			level: severity,
			timestamp: Date.now(),
		});

		/**
		 * If a log, also capture as a message
		 */
		if (level === LogLevel.Log) {
			Sentry.captureMessage(message, {
				tags,
				extra: metadata,
			});
		}

		/**
		 * If warn, also capture as a message, but with level warning
		 */
		if (level === LogLevel.Warn) {
			Sentry.captureMessage(message, {
				level: severity,
				tags,
				extra: metadata,
			});
		}
	} else {
		/**
		 * It's otherwise an Error and should be reported as onReady
		 */
		Sentry.captureException(message, {
			tags,
			extra: metadata,
		});
	}
};

export class ErrorLog extends Error {}

/**
 * Main class. Defaults are provided in the constructor so that subclasses are
 * technically possible, if we need to go that route in the future.
 */
export class Logger {
	LogLevel = LogLevel;

	DebugContext = DebugContext;

	enabled: boolean;

	level: LogLevel;

	transports: Transport[] = [];

	constructor({
		enabled = IS_DEV === 'true' || false,
		level = LOG_LEVEL as LogLevel,
	}: {
		enabled?: boolean;
		level?: LogLevel;
	} = {}) {
		this.enabled = enabled;
		this.level = level || LogLevel.Debug;
	}

	debug(message: string, metadata: Metadata = {}) {
		this.transport(LogLevel.Debug, message, metadata);
	}

	info(message: string, metadata: Metadata = {}) {
		this.transport(LogLevel.Info, message, metadata);
	}

	log(message: string, metadata: Metadata = {}) {
		this.transport(LogLevel.Log, message, metadata);
	}

	warn(message: string, metadata: Metadata = {}) {
		this.transport(LogLevel.Warn, message, metadata);
	}

	error(error: ErrorLog, metadata: Metadata = {}) {
		if (error instanceof ErrorLog) {
			this.transport(LogLevel.Error, error, metadata);
		} else {
			this.transport(LogLevel.Error, new ErrorLog('logger.error was not provided a ErrorLog'), metadata);
		}
	}

	addTransport(transport: Transport) {
		this.transports.push(transport);
		return () => {
			this.transports.splice(this.transports.indexOf(transport), 1);
		};
	}

	disable() {
		this.enabled = false;
	}

	enable() {
		this.enabled = true;
	}

	protected transport(level: LogLevel, message: string | ErrorLog, metadata: Metadata = {}) {
		if (!this.enabled) return;
		console.log(enabledLogLevels, this.level, level);
		if (!enabledLogLevels[this.level].includes(level)) return;

		// eslint-disable-next-line no-restricted-syntax
		for (const transport of this.transports) {
			// metadata fallback accounts for JS usage
			transport(level, message, metadata || {});
		}
	}
}

/**
 * See `@/logger/README` for docs.
 *
 * Basic usage:
 *
 *   `logger.debug(message[, metadata, debugContext])`
 *   `logger.info(message[, metadata])`
 *   `logger.warn(message[, metadata])`
 *   `logger.error(error[, metadata])`
 *   `logger.disable()`
 *   `logger.enable()`
 */
export const logger = new Logger();

/**
 * Report to console in dev, Sentry in prod, nothing in test.
 */
if (IS_DEV) {
	logger.addTransport(consoleTransport);
} else {
	logger.addTransport(sentryTransport);
	logger.addTransport(consoleTransport);
}
