export default owaspPasswordStrengthTest;

interface PasswordTestResult {
    /** error messages associated with the failed tests */
    errors: string[];
    /** enumerates which tests have failed, beginning from 0 with the first required test */
    failedTests: number[];
    /** enumerates which tests have succeeded, beginning from 0 with the first required test */
    passedTests: number[];
    /** error messages of required tests that have failed */
    requiredTestErrors: string[];
    /** error messages of optional tests that have failed */
    optionalTestErrors: string[];
    /** indicates whether or not the password was considered to be a passphrase */
    isPassphrase: boolean;
    /** indicates whether or not the user's password satisfied the strength requirements */
    strong: boolean;
    /**  indicates how many of the optional tests were passed. In order for the password to be considered "strong", it (by default) must either be a passphrase, or must pass a number of optional tests that is equal to or greater than configs.minOptionalTestsToPass */
    optionalTestsPassed: number;
}
interface PasswordTestConfiguration {
    /** Toggles the "passphrase" mechanism on and off. If set to false, the strength-checker will abandon the notion of "passphrases", and will subject all passwords to the same complexity requirements. */
    allowPassphrases?: boolean;
    /** constraint on a password's maximum length */
    maxLength?: number;
    /** constraint on a password's minimum length */
    minLength?: number;
    /** minimum length a password needs to achieve in order to be considered a "passphrase" (and thus exempted from the optional complexity tests by default) */
    minPhraseLength?: number;
    /** minimum number of optional tests that a password must pass in order to be considered "strong". By default (per the OWASP guidelines), four optional complexity tests are made, and a password must pass at least three of them in order to be considered "strong" */
    minOptionalTestsToPass?: number;
}

type PasswordTest = (password: string) => boolean;

export declare namespace owaspPasswordStrengthTest {
    export function test(password: string): PasswordTestResult;
    export function config(configuration: PasswordTestConfiguration): void;

    export let tests: {
        required: PasswordTest[];
        optional: PasswordTest[];
    };
}