import React from "react";

export default function Header() {
  return (
    <div>
      <nav className="navbar bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">Serverless B&B</a>
          <div className="row">
            <div className="col">
              <button className="btn btn-outline-success" type="submit">
                Login
              </button>
            </div>
            <div className="col">
              <button className="btn btn-outline-success" type="submit">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
