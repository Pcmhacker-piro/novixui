import { expectAssignable, expectError } from 'tsd';
import { Button } from 'novix-ui';

expectAssignable<Parameters<typeof Button>[0]>({ variant: 'primary', size: 'md' });
expectError<Parameters<typeof Button>[0]>({ variant: 'bogus' });
