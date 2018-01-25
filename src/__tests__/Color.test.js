import Color from '../Color';

it('should compare Color with snapshot', () => {
  expect(Color).toMatchSnapshot();
});
