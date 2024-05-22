/* eslint-disable prefer-destructuring */
import * as Sentry from '@sentry/react-native';
import { logger, ErrorLog } from '@/services/logger';

const IS_DEV = process.env.IS_DEV;
const SENTRY_DSN = process.env.SENTRY_DSN;
const APP_VERSION = process.env.APP_VERSION;
const BUNDLE_IDENTIFIER = process.env.BUNDLE_IDENTIFIER;

/**
 * We need to disable React Navigation instrumentation for E2E tests because
 * detox doesn't like setTimeout calls that are used inside When enabled detox
 * hangs and timeouts on all test cases
 */
export const sentryRoutingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const defaultOptions = {
	dsn: SENTRY_DSN,
	enableAutoSessionTracking: true,
	environment: 'production',
	integrations: [
		new Sentry.ReactNativeTracing({
			routingInstrumentation: sentryRoutingInstrumentation,
			tracingOrigins: ['localhost', /^\//],
		}),
	],
	tracesSampleRate: 0.2,
};

export function initializeSentry() {
	if (IS_DEV) {
		logger.debug('Sentry is disabled for test environment');
		return;
	}
	try {
		const release = `${BUNDLE_IDENTIFIER}@${APP_VERSION}`;

		Sentry.init({
			...defaultOptions,
			dist: APP_VERSION,
			release,
		});

		logger.debug('Sentry initialized');
	} catch (e) {
		logger.error(new ErrorLog('Sentry initialization failed'));
	}
}
