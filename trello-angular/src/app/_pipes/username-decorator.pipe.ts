import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usernameDecorator'
})
export class UsernameDecoratorPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return this.decorateText(value);
  }


  private decorateText(text: string): string {
    let regExp = /(?:^|\s)(@\w{2,})/g; //gets @Username
    let users: string[] = [];
    let exp = undefined;
    let nonDecoratedTextIndex = 0;
    let result: string = "";
    while(exp !== null) {
      exp = regExp.exec(text);
      if (exp !== null) {
        let username: string = exp[0];
        result += text.slice(nonDecoratedTextIndex, exp.index) + this.decorateUsername(username); 
        nonDecoratedTextIndex = exp.index + username.length;
      } else {
        result += text.slice(nonDecoratedTextIndex);
      }
    }
    return result;
  } 


  private decorateUsername(username: string) {
    return `<b><i>${username}</i></b>`;
  }

}
