import React from "react";
import './homepage.css';   
export default function Header() {
  return (
    <div>
      <section className="ftco-booking ftco-section ftco-no-pt ftco-no-pb">
        <div class="container">
          <div class="row no-gutters">
            <div class="col-lg-12">
              <form action="#" class="booking-form aside-stretch">
                <div class="row">
                  <div class="col-md d-flex py-md-4">
                    <div class="form-group align-self-stretch d-flex align-items-end">
                      <div class="wrap align-self-stretch py-3 px-4">
                        <label for="#">Check-in Date</label>
                        <input
                          type="text"
                          class="form-control checkin_date"
                          placeholder="Check-in date"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md d-flex py-md-4">
                    <div class="form-group align-self-stretch d-flex align-items-end">
                      <div class="wrap align-self-stretch py-3 px-4">
                        <label for="#">Check-out Date</label>
                        <input
                          type="text"
                          class="form-control checkout_date"
                          placeholder="Check-out date"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md d-flex py-md-4">
                    <div class="form-group align-self-stretch d-flex align-items-end">
                      <div class="wrap align-self-stretch py-3 px-4">
                        <label for="#">Room</label>
                        <div class="form-field">
                          <div class="select-wrap">
                            <div class="icon">
                              <span class="ion-ios-arrow-down"></span>
                            </div>
                            <select name="" id="" class="form-control">
                              <option value="">Suite</option>
                              <option value="">Family Room</option>
                              <option value="">Deluxe Room</option>
                              <option value="">Classic Room</option>
                              <option value="">Superior Room</option>
                              <option value="">Luxury Room</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md d-flex py-md-4">
                    <div class="form-group align-self-stretch d-flex align-items-end">
                      <div class="wrap align-self-stretch py-3 px-4">
                        <label for="#">Guests</label>
                        <div class="form-field">
                          <div class="select-wrap">
                            <div class="icon">
                              <span class="ion-ios-arrow-down"></span>
                            </div>
                            <select name="" id="" class="form-control">
                              <option value="">1 Adult</option>
                              <option value="">2 Adult</option>
                              <option value="">3 Adult</option>
                              <option value="">4 Adult</option>
                              <option value="">5 Adult</option>
                              <option value="">6 Adult</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md d-flex">
                    <div class="form-group d-flex align-self-stretch">
                      <a
                        href="#"
                        class="btn btn-primary py-5 py-md-3 px-4 align-self-stretch d-block"
                      >
                        <span>
                          Check Availability{" "}
                          <small>Best Price Guaranteed!</small>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
