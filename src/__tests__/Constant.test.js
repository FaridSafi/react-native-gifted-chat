import * as Constant from '../Constant';

it('should compare Constant with snapshot', () => {
  expect(Constant).toMatchSnapshot();
});
