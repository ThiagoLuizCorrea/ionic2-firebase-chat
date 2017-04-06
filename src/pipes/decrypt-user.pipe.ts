import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'decryptUser'
})
@Injectable()
export class DecryptUserPipe {

  transform(object) {
    return object[Object.keys(object)[0]];
  }

}
