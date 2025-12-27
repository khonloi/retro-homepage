import React, { memo, useMemo } from 'react';
import './Contact.css';
import mailboxIcon from './Microsoft Windows 3 Mailbox.ico';
import phoneIcon from './Microsoft Windows 3 Phone Dial.ico';
import mailIcon from './Microsoft Windows 3 Mail.ico';
import globeIcon from './Microsoft Windows 3 International.ico';
import nmkSvg from './nmk.svg';

// Contact information data structure
const CONTACT_INFO = [
  {
    id: 'phone',
    icon: phoneIcon,
    label: 'Phone',
    value: '(+84) 35710 6894',
    href: 'tel:+84357106894',
    isLink: true,
    className: 'phone-email',
  },
  {
    id: 'email',
    icon: mailIcon,
    label: 'Email',
    value: 'nguyenminhkhoi3913@gmail.com',
    href: 'mailto:nguyenminhkhoi3913@gmail.com',
    isLink: true,
    className: 'phone-email',
  },
  {
    id: 'website',
    icon: globeIcon,
    label: 'Website',
    value: 'https://khonloi.github.io/retro-homepage',
    href: 'https://khonloi.github.io/retro-homepage',
    isLink: true,
    className: 'phone-email',
  },
  {
    id: 'address',
    icon: mailboxIcon,
    label: 'Address',
    value: '600 Nguyen Van Cu Extended, An Binh Ward, Can Tho, Vietnam',
    isLink: false,
    className: '',
  },
];

const Contact = memo(() => {
  const contactItems = useMemo(
    () =>
      CONTACT_INFO.map((item) => (
        <p key={item.id} className={`contact-info ${item.className}`}>
          <strong>
            <img src={item.icon} alt={item.label} className="folder-icon" /> {item.label}:
          </strong>
          {item.isLink ? (
            <span className="contact-detail">
              <a href={item.href} className="contact-link">
                {item.value}
              </a>
            </span>
          ) : (
            <span className="contact-detail">{item.value}</span>
          )}
        </p>
      )),
    []
  );

  return (
    <div className="contact-container">
      <div className="contact-title">
        <img src={nmkSvg} alt="Monogram" className="monogram" />
        <div className="contact-title-group">
          <h2 className="name">Nguyen Minh Khoi</h2>
          <p className="title">Full Stack Developer</p>
        </div>
      </div>
      {contactItems}
    </div>
  );
});

Contact.displayName = 'Contact';

export default Contact;