export interface PasswordStrengthTestResult {
  errors              : any[];
  failedTests         : any[];
  passedTests         : any[];
  requiredTestErrors  : any[];
  optionalTestErrors  : any[];
  isPassphrase        : boolean;
  strong              : boolean;
  optionalTestsPassed : number;
}
