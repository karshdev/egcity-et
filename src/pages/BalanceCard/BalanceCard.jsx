import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Balancecard.css";
import logo from "../../assets/png/evergreen.png";
import { ReactComponent as ThreeIcon } from "../../assets/svgs/three.svg";
import { ReactComponent as FrameIcon } from "../../assets/svgs/Frame2.svg";
import { ReactComponent as Icon } from "../../assets/svgs/Icon.svg";
import Menu from "../../components/Menu";
import TransactionInfo from "../../components/TransactionInfo";
import { addDays, subDays, addMonths, subMonths } from "date-fns";
import AddButton from "../../components/AddButton";
import { useGetDashboardTransactionDataQuery } from "../../service/api";

function BalanceCard() {
  const [toggle, setToggle] = useState("D");
  const [dashboardData, setDashboardData] = useState({
    transactionsByType: {
      EXPENSE: [],
      INCOME: [],
    },
    carryForward: 0,
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    usernam: "anonymous",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);
  console.log(selectedDate,"selectedDate")
  const { data, refetch } = useGetDashboardTransactionDataQuery(formatDate(selectedDate));


  const handleToggle = (value) => {
    setToggle(value);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if(toggle === "M") return `${year}-${month}`;
    return `${year}-${month}-${day}`;
  }

  const handleDateChange = async(date) => {
    // const formattedDate = await formatDate(date)
    setSelectedDate(date);
    // console.log(formattedDate,"formattedDate")
    refetch()
  };

  const handlePrevDate = () => {
    if (toggle === "D") {
      setSelectedDate((prevDate) => subDays(prevDate, 1));
    } else if (toggle === "M") {
      setSelectedDate((prevDate) => subMonths(prevDate, 1));
    }
  };

  const handleNextDate = () => {
    if (toggle === "D") {
      setSelectedDate((prevDate) => addDays(prevDate, 1));
    } else if (toggle === "M") {
      setSelectedDate((prevDate) => addMonths(prevDate, 1));
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const menuRef = useRef(null);

  const items = [
    {
      label: "Charts",
      onClick: () => {
        console.log("Change Category clicked");
        setShowMenu(false);
      },
    },
    {
      label: "Need help?",
      onClick: () => {
        setShowMenu(false);
      },
    },
    {
      label: "Settings",
      onClick: () => {
        setShowMenu(false);
      },
    },
    {
      label: "Export to PDF",
      onClick: () => {
        setShowMenu(false);
      },
    },
    {
      label: "Documentation Vault",
      onClick: () => {
        setShowMenu(false);
      },
    },
    {
      label: "History",
      onClick: () => {
        setShowMenu(false);
      },
    },
  ];

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (data) {
      console.log(data.username,"username")
      setDashboardData({
        transactionsByType: {
          EXPENSE: data?.transactionsByType?.EXPENSE,
          INCOME: data?.transactionsByType?.INCOME,
        },
        carryForward: data.carryForward,
        totalIncome: data.totalIncome,
        totalExpense: data.totalExpense,
        balance: data.balance,
        usernam: data.username,
      });
    }
  }, [data]);

  return (
    <div>
      <div className="balance-card">
        <div className="header">
          <div style={{ display: "flex", gap: "5px" }}>
            <img src={logo} alt="Logo" className="logo" />
            <p style={{ fontSize: "14px", color: "#fff" }}>
              Hi, {user?.username}
            </p>
          </div>
          <div className="user-info">
            <div className="icons">
              <Icon className="search-icon" />
              {!user?.username && (
                <a href="/login">
                  <ThreeIcon className="menu-icon" />
                </a>
              )}
              <div className="dots-container">
                <FrameIcon
                  className="frame-icon"
                  onClick={() => setShowMenu(!showMenu)}
                  ref={menuRef}
                />
                {showMenu && <Menu items={items} />}
              </div>
            </div>
          </div>
        </div>
        <div className="balance-info">
          <div>
            <p>Total Balance</p>
            <h2>{dashboardData.balance}</h2>
          </div>
          <div className="toggle-group">
            <div
              className={`toggle-btn ${toggle === "D" ? "selected" : ""}`}
              onClick={() => handleToggle("D")}
            >
              D
            </div>
            <div
              className={`toggle-btn ${toggle === "M" ? "selected" : ""}`}
              onClick={() => handleToggle("M")}
            >
              M
            </div>
          </div>
        </div>
        <div className="date-selector">
          <button className="prev-date" onClick={handlePrevDate}>
            {"<"}
          </button>
          <div className="date-display">
            {toggle === "D" ? (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="d, MMM yy EEE"
              />
            ) : (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MMM yy"
                showMonthYearPicker
              />
            )}
          </div>
          <button className="next-date" onClick={handleNextDate}>
            {">"}
          </button>
        </div>
      </div>
      <TransactionInfo
        totalIncome={dashboardData.totalIncome}
        totalExpense={dashboardData.totalExpense}
        carryForward={dashboardData.carryForward}
        expense={dashboardData.transactionsByType.EXPENSE}
        income={dashboardData.transactionsByType.INCOME}
      />
    </div>
  );
}

export default BalanceCard;
