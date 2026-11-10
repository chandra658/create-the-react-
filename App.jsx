
import React, { useMemo, useState } from 'react';
import {
  CarFront, Search, User, CalendarDays, MapPin,
  Fuel, Users, Settings, LogOut, Menu, X,
  CheckCircle, ShieldCheck, CreditCard
} from 'lucide-react';
import './App.css';

const initialCars = [
  {
    id: 1, name: 'Hyundai Creta', type: 'SUV',
    price: 2800, seats: 5, fuel: 'Petrol',
    gear: 'Automatic',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80',
    available: true, tag: 'Popular'
  },
  {
    id: 2, name: 'Maruti Swift', type: 'Hatchback',
    price: 1600, seats: 5, fuel: 'Petrol',
    gear: 'Manual',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80',
    available: true, tag: 'Budget'
  },
  {
    id: 3, name: 'Toyota Innova Crysta', type: 'MUV',
    price: 3800, seats: 7, fuel: 'Diesel',
    gear: 'Manual',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
    available: true, tag: 'Family'
  },
  {
    id: 4, name: 'BMW 3 Series', type: 'Luxury',
    price: 7500, seats: 5, fuel: 'Petrol',
    gear: 'Automatic',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    available: true, tag: 'Premium'
  },
  {
    id: 5, name: 'Tata Nexon EV', type: 'Electric',
    price: 3200, seats: 5, fuel: 'Electric',
    gear: 'Automatic',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80',
    available: true, tag: 'Eco'
  },
  {
    id: 6, name: 'Mahindra Thar', type: 'SUV',
    price: 4200, seats: 4, fuel: 'Diesel',
    gear: 'Manual',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    available: true, tag: 'Adventure'
  }
];

const money = n =>
  '₹' + Number(n).toLocaleString('en-IN');

export default function App() {
  const [cars, setCars] = useState(initialCars);

  const [bookings, setBookings] = useState(() =>
    JSON.parse(localStorage.getItem('klBookings') || '[]')
  );

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('klUser') || 'null')
  );

  const [page, setPage] = useState('home');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');

  const [loginOpen, setLoginOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [booking, setBooking] = useState({
    pickup: 'Guntur',
    start: '',
    end: '',
    days: 1
  });

  const [payMethod, setPayMethod] = useState('UPI');

  const filtered = useMemo(
    () => cars.filter(c =>
      (type === 'All' || c.type === type) &&
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      c.available
    ),
    [cars, type, search]
  );

  const saveBookings = b => {
    setBookings(b);
    localStorage.setItem('klBookings', JSON.stringify(b));
  };

  const flash = m => {
    setNotice(m);
    setTimeout(() => setNotice(''), 3200);
  };

  const login = e => {
    e.preventDefault();

    const u = {
      name: form.name || form.email.split('@')[0],
      email: form.email,
      role: form.email.toLowerCase() ===
        'admin@drivenow.com' ? 'admin' : 'customer'
    };

    setUser(u);
    localStorage.setItem('klUser', JSON.stringify(u));
    setLoginOpen(false);

    setForm({ name: '', email: '', password: '' });
    flash('Welcome to KL DriveNow!');

    if (selected) {
      setPage('booking');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('klUser');
    setPage('home');
    flash('You have been logged out.');
  };

  const startBooking = car => {
    if (!user) {
      setSelected(car);
      setLoginOpen(true);
      return;
    }

    setSelected(car);
    setPage('booking');
  };

  const confirmBooking = e => {
    e.preventDefault();

    if (!booking.start || !booking.end) {
      flash('Please select pickup and return dates.');
      return;
    }

    const days = Math.ceil(
      (new Date(booking.end) - new Date(booking.start)) /
      86400000
    );

    if (days < 1) {
      flash('Return date must be after pickup date.');
      return;
    }

    setBooking({ ...booking, days });
    setPage('payment');
  };

  const pay = () => {
    const b = {
      id: 'KL' + Date.now().toString().slice(-7),
      car: selected.name,
      carId: selected.id,
      customer: user.name,
      email: user.email,
      pickup: booking.pickup,
      start: booking.start,
      end: booking.end,
      days: booking.days,
      total: selected.price * booking.days,
      status: 'Confirmed',
      method: payMethod
    };

    saveBookings([b, ...bookings]);
    setPage('success');
  };

  const nav = p => {
    setPage(p);
    setMobile(false);
  };

  return (
    <div className="app">

      <header className="header">
        <div className="nav wrap">

          <button
            className="brand"
            onClick={() => nav('home')}
          >
            <span className="brand-icon">
              <CarFront />
            </span>

            <span>
              KL <b>DriveNow</b>
              <small>CAR RENTAL</small>
            </span>
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>

          <nav className={mobile ? 'open' : ''}>
            <button onClick={() => nav('home')}>Home</button>
            <button onClick={() => nav('cars')}>Explore Cars</button>
            <button onClick={() => nav('mybookings')}>
              My Bookings
            </button>

            {user?.role === 'admin' && (
              <button onClick={() => nav('admin')}>
                Admin
              </button>
            )}
          </nav>

          <div className="nav-right">
            {user ? (
              <>
                <span className="welcome">
                  <User size={16} /> {user.name}
                </span>

                <button
                  className="outline small"
                  onClick={logout}
                >
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <button
                className="primary small"
                onClick={() => setLoginOpen(true)}
              >
                Login / Sign up
              </button>
            )}
          </div>

        </div>
      </header>

      {notice && (
        <div className="toast">
          <CheckCircle size={17} />
          {notice}
        </div>
      )}

      {page === 'home' && (
        <>
          <section className="hero">
            <div className="wrap hero-content">
              <span className="eyebrow">
                YOUR JOURNEY, YOUR WAY
              </span>

              <h1>
                Find the perfect car
                <br />
                for <em>every journey.</em>
              </h1>

              <p>
                Book reliable cars at great prices.
                Simple, safe and ready when you are.
              </p>

              <button
                className="primary large"
                onClick={() => nav('cars')}
              >
                Explore our cars →
              </button>

              <div className="hero-stats">
                <div>
                  <b>50+</b>
                  <small>Cars available</small>
                </div>

                <div>
                  <b>1,200+</b>
                  <small>Happy customers</small>
                </div>

                <div>
                  <b>24/7</b>
                  <small>Customer support</small>
                </div>
              </div>
            </div>
          </section>

          <section className="wrap section">
            <div className="section-head">
              <div>
                <span className="eyebrow">
                  HANDPICKED FOR YOU
                </span>

                <h2>Popular rental cars</h2>
                <p>
                  Choose a ride that fits your plans and budget.
                </p>
              </div>

              <button
                className="text-btn"
                onClick={() => nav('cars')}
              >
                View all cars →
              </button>
            </div>

            <div className="car-grid">
              {cars.slice(0, 3).map(c => (
                <CarCard
                  key={c.id}
                  car={c}
                  onBook={startBooking}
                />
              ))}
            </div>
          </section>

          <section className="benefits">
            <div className="wrap benefit-grid">
              <div>
                <ShieldCheck />
                <h3>Trusted & secure</h3>
                <p>Clear pricing and verified vehicle listings.</p>
              </div>

              <div>
                <CreditCard />
                <h3>Easy payments</h3>
                <p>Simple demo checkout and instant confirmation.</p>
              </div>

              <div>
                <CalendarDays />
                <h3>Flexible booking</h3>
                <p>Choose dates that work for your journey.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {page === 'cars' && (
        <section className="wrap section page-section">
          <span className="eyebrow">OUR FLEET</span>
          <h2>Find your perfect ride</h2>

          <p className="muted">
            Browse our available cars and compare daily rates.
          </p>

          <div className="filters">
            <div className="searchbox">
              <Search size={18} />

              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by car name..."
              />
            </div>

            <select
              value={type}
              onChange={e => setType(e.target.value)}
            >
              {['All', 'SUV', 'Hatchback', 'MUV', 'Luxury', 'Electric'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="car-grid">
            {filtered.map(c => (
              <CarCard
                key={c.id}
                car={c}
                onBook={startBooking}
              />
            ))}
          </div>

          {!filtered.length && (
            <p>No cars match your search.</p>
          )}
        </section>
      )}

      {page === 'booking' && selected && (
        <section className="wrap section narrow">
          <button
            className="back"
            onClick={() => nav('cars')}
          >
            ← Back to cars
          </button>

          <span className="eyebrow">RESERVE YOUR RIDE</span>
          <h2>Booking details</h2>

          <div className="checkout-card">
            <div className="checkout-car">
              <img src={selected.image} alt={selected.name} />

              <div>
                <b>{selected.name}</b>
                <p>
                  {selected.type} · {selected.gear} · {selected.fuel}
                </p>
                <strong>{money(selected.price)} / day</strong>
              </div>
            </div>

            <form
              onSubmit={confirmBooking}
              className="form-grid"
            >
              <label>
                <MapPin /> Pickup location

                <input
                  value={booking.pickup}
                  onChange={e =>
                    setBooking({
                      ...booking,
                      pickup: e.target.value
                    })
                  }
                  required
                />
              </label>

              <label>
                <CalendarDays /> Pickup date

                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={booking.start}
                  onChange={e =>
                    setBooking({
                      ...booking,
                      start: e.target.value
                    })
                  }
                  required
                />
              </label>

              <label>
                <CalendarDays /> Return date

                <input
                  type="date"
                  min={booking.start || new Date().toISOString().slice(0, 10)}
                  value={booking.end}
                  onChange={e =>
                    setBooking({
                      ...booking,
                      end: e.target.value
                    })
                  }
                  required
                />
              </label>

              <button
                className="primary large full"
                type="submit"
              >
                Continue to payment →
              </button>
            </form>
          </div>
        </section>
      )}

      {page === 'payment' && selected && (
        <section className="wrap section narrow">
          <span className="eyebrow">SECURE CHECKOUT DEMO</span>
          <h2>Review & pay</h2>

          <div className="checkout-card">
            <h3>Booking summary</h3>

            <div className="summary-line">
              <span>
                {selected.name} × {booking.days} day(s)
              </span>

              <b>{money(selected.price * booking.days)}</b>
            </div>

            <div className="summary-line">
              <span>Taxes & fees</span>
              <b>Included</b>
            </div>

            <hr />

            <div className="summary-line total">
              <span>Total amount</span>
              <b>{money(selected.price * booking.days)}</b>
            </div>

            <h3>Payment method</h3>

            <div className="payment-options">
              {['UPI', 'Credit / Debit Card', 'Pay at pickup'].map(m => (
                <button
                  key={m}
                  className={payMethod === m ? 'selected' : ''}
                  onClick={() => setPayMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            <p className="muted tiny">
              This is a front-end demonstration.
              No real payment will be collected.
            </p>

            <button
              className="primary large full"
              onClick={pay}
            >
              Confirm demo booking · {money(selected.price * booking.days)}
            </button>
          </div>
        </section>
      )}

      {page === 'success' && (
        <section className="wrap section narrow center">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>

          <span className="eyebrow">BOOKING CONFIRMED</span>
          <h2>Your ride is reserved!</h2>

          <p className="muted">
            Your demo booking has been saved in this browser.
          </p>

          <button
            className="primary large"
            onClick={() => nav('mybookings')}
          >
            View my bookings
          </button>
        </section>
      )}

      {page === 'mybookings' && (
        <section className="wrap section page-section">
          <span className="eyebrow">YOUR TRIPS</span>
          <h2>My bookings</h2>

          {!user ? (
            <div className="empty">
              <p>Please log in to view your bookings.</p>

              <button
                className="primary"
                onClick={() => setLoginOpen(true)}
              >
                Login
              </button>
            </div>
          ) : (
            <BookingList
              bookings={bookings.filter(
                b => b.email === user.email
              )}
            />
          )}
        </section>
      )}

      {page === 'admin' && (
        <section className="wrap section page-section">
          <span className="eyebrow">MANAGEMENT CONSOLE</span>
          <h2>Admin dashboard</h2>

          {user?.role !== 'admin' ? (
            <p>
              Admin access required.
              Log in with admin@drivenow.com.
            </p>
          ) : (
            <>
              <div className="admin-stats">
                <div>
                  <small>Total cars</small>
                  <b>{cars.length}</b>
                </div>

                <div>
                  <small>Total bookings</small>
                  <b>{bookings.length}</b>
                </div>

                <div>
                  <small>Confirmed revenue</small>
                  <b>
                    {money(
                      bookings.reduce((s, b) => s + b.total, 0)
                    )}
                  </b>
                </div>
              </div>

              <h3>Vehicle inventory</h3>

              <div className="admin-list">
                {cars.map(c => (
                  <div key={c.id}>
                    <span>
                      {c.name}
                      <small>
                        {c.type} · {money(c.price)}/day
                      </small>
                    </span>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        setCars(cars.map(x =>
                          x.id === c.id
                            ? { ...x, available: !x.available }
                            : x
                        ))
                      }
                    >
                      {c.available
                        ? 'Mark unavailable'
                        : 'Mark available'}
                    </button>
                  </div>
                ))}
              </div>

              <h3>All bookings</h3>
              <BookingList bookings={bookings} />
            </>
          )}
        </section>
      )}

      <footer>
        <div className="wrap footer-inner">
          <div className="brand footer-brand">
            <CarFront /> KL <b>DriveNow</b>
          </div>

          <p>
            © 2026 KL DriveNow. Student project demonstration.
          </p>

          <span>Drive safe. Go further.</span>
        </div>
      </footer>

      {loginOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setLoginOpen(false)}
            >
              <X />
            </button>

            <span className="eyebrow">
              WELCOME TO DRIVENOW
            </span>

            <h2>Login / Create account</h2>

            <p className="muted">
              Enter your details to continue.
            </p>

            <form onSubmit={login}>
              <label>
                Full name (optional)

                <input
                  value={form.name}
                  onChange={e =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                Email address

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Password

                <input
                  type="password"
                  required
                  minLength="4"
                  value={form.password}
                  onChange={e =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="At least 4 characters"
                />
              </label>

              <button className="primary large full">
                Continue
              </button>
            </form>

            <p className="tiny muted">
              Admin demo: admin@drivenow.com
              (any password, 4+ characters).
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

function CarCard({ car, onBook }) {
  return (
    <article className="car-card">
      <div className="car-photo">
        <img
          src={car.image}
          alt={car.name}
          onError={e => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80';
          }}
        />

        <span className="tag">{car.tag}</span>
      </div>

      <div className="car-info">
        <div className="car-title">
          <div>
            <h3>{car.name}</h3>
            <small>{car.type}</small>
          </div>

          <div className="price">
            {money(car.price)}
            <small>/ day</small>
          </div>
        </div>

        <div className="specs">
          <span><Users /> {car.seats} seats</span>
          <span><Fuel /> {car.fuel}</span>
          <span><Settings /> {car.gear}</span>
        </div>

        <button
          className="primary full"
          disabled={!car.available}
          onClick={() => onBook(car)}
        >
          {car.available ? 'Book this car' : 'Unavailable'} →
        </button>
      </div>
    </article>
  );
}

function BookingList({ bookings }) {
  return bookings.length ? (
    <div className="booking-list">
      {bookings.map(b => (
        <div className="booking-row" key={b.id}>
          <div>
            <b>{b.car}</b>

            <small>
              {b.id} · {b.start} to {b.end} · {b.pickup}
            </small>

            <small>{b.customer}</small>
          </div>

          <div className="booking-right">
            <b>{money(b.total)}</b>
            <span className="confirmed">{b.status}</span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="empty">
      <CalendarDays size={32} />
      <p>
        No bookings yet. Explore cars to make your first reservation.
      </p>
    </div>
  );
}
