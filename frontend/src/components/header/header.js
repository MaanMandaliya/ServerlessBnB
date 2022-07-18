import React from "react";

export default function Header() {
  return (
    <div>
      {/* <nav className="navbar bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">Serverless B&B</a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ">
              <li className="nav-item ">
                <a className="nav-link" href="/user-report">
                  User statistics
                </a>
              </li>
              <li className="nav-item ">
                <a className="nav-link" href="/user-report">
                  Food ordering statistics
                </a>
              </li>
              <li className="nav-item ">
                <a className="nav-link" href="/user-report">
                  Customer booking statistics
                </a>
              </li>
            </ul>
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
        </div>
      </nav> */}
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand">
          Serverless B&B
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="/user-report">
                User statistics
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/booking-report">
                Customer booking statistics
              </a>
            </li>
          
            <li class="nav-item">
              <a class="nav-link " href="/food-report">
                Food ordering statistics
              </a>
            </li>
          </ul>
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
