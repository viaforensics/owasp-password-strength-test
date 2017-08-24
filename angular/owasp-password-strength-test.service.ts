import { Injectable } from '@angular/core';
import { PasswordStrengthTestResult } from './password-strength-result.interface';

interface Configs {
  allowPassphrases: boolean;
  maxLength: number;
  minLength: number;
  minPhraseLength: number;
  minOptionalTestsToPass: number;
}

@Injectable()
export class PasswordStrengthService {

  constructor(

  ){}

  configs: Configs = {
    allowPassphrases       : true,
    maxLength              : 128, // not working: hard coded value bellow
    minLength              : 8,   // not working: hard coded value bellow
    minPhraseLength        : 20,
    minOptionalTestsToPass : 4
  }

  config (params : Configs) {
    for (let prop in params) {
      if (params.hasOwnProperty(prop) && this.configs.hasOwnProperty(prop)) {
        this.configs[prop] = params[prop];
      }
    }
  }

  // This is an object containing the tests to run against all passwords.
  tests = {

    // An array of required tests. A password *must* pass these tests in order
    // to be considered strong.
    required: [

      // enforce a minimum length
      function(password) {
        if (password.length < 8) {
          return 'The password must be at least 8 characters long.';
        }
      },

      // enforce a maximum length
      function(password) {
        if (password.length > 128) {
          return 'The password must be fewer than 128 characters.';
        }
      },

      // forbid repeating characters
      function(password) {
        if (/(.)\1{2,}/.test(password)) {
          return 'The password may not contain sequences of three or more repeated characters.';
        }
      },

    ],

    // An array of optional tests. These tests are "optional" in two senses:
    //
    // 1. Passphrases (passwords whose length exceeds
    //    this.configs.minPhraseLength) are not obligated to pass these tests
    //    provided that this.configs.allowPassphrases is set to Boolean true
    //    (which it is by default).
    //
    // 2. A password need only to pass this.configs.minOptionalTestsToPass
    //    number of these optional tests in order to be considered strong.
    optional: [

      // require at least one lowercase letter
      function(password) {
        if (!/[a-z]/.test(password)) {
          return 'The password must contain at least one lowercase letter.';
        }
      },

      // require at least one uppercase letter
      function(password) {
        if (!/[A-Z]/.test(password)) {
          return 'The password must contain at least one uppercase letter.';
        }
      },

      // require at least one number
      function(password) {
        if (!/[0-9]/.test(password)) {
          return 'The password must contain at least one number.';
        }
      },

      // require at least one special character
      function(password) {
        if (!/[^A-Za-z0-9]/.test(password)) {
          return 'The password must contain at least one special character.';
        }
      },

    ],
  }

  test (password) : PasswordStrengthTestResult {

    // create an object to store the test results
    let result : PasswordStrengthTestResult = {
      errors              : [],
      failedTests         : [],
      passedTests         : [],
      requiredTestErrors  : [],
      optionalTestErrors  : [],
      isPassphrase        : false,
      strong              : true,
      optionalTestsPassed : 0
    }

    // Always submit the password/passphrase to the required tests
    var i = 0;
    this.tests.required.forEach(function(test) {
      var err = test(password);
      if (typeof err === 'string') {
        result.strong = false;
        result.errors.push(err);
        result.requiredTestErrors.push(err);
        result.failedTests.push(i);
      } else {
        result.passedTests.push(i);
      }
      i++;
    });

    // If configured to allow passphrases, and if the password is of a
    // sufficient length to consider it a passphrase, exempt it from the
    // optional tests.
    if (
      this.configs.allowPassphrases === true &&
      password.length >= this.configs.minPhraseLength
    ) {
      result.isPassphrase = true;
    }

    if (!result.isPassphrase) {
      var j = this.tests.required.length;
      this.tests.optional.forEach(function(test) {
        var err = test(password);
        if (typeof err === 'string') {
          result.errors.push(err);
          result.optionalTestErrors.push(err);
          result.failedTests.push(j);
        } else {
          result.optionalTestsPassed++;
          result.passedTests.push(j);
        }
        j++;
      });
    }

    // If the password is not a passphrase, assert that it has passed a
    // sufficient number of the optional tests, per the configuration
    if (
      !result.isPassphrase &&
      result.optionalTestsPassed < this.configs.minOptionalTestsToPass
    ) {
      result.strong = false;
    }

    // return the result
    return result;
  }
}
