import { useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" style={{ textAlign: 'center' }}>
      <h1>糟糕!</h1>
      <p>系统错误请稍后再试</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}