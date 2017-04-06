import { UsernameDecoratorPipe } from './username-decorator.pipe';

describe('UsernameDecoratorPipe', () => {
  it('create an instance', () => {
    const pipe = new UsernameDecoratorPipe();
    expect(pipe).toBeTruthy();
  });
});
