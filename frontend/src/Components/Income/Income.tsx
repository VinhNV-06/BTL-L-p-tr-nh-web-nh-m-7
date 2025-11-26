import React, { useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/useGlobalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

type IncomeInputState = {
  title: string;
  amount: string;
  date: Date | null;
  category: string;
  description: string;
};

const Income: React.FC = () => {
  const { addIncome, error, setError } = useGlobalContext();

  const [inputState, setInputState] = useState<IncomeInputState>({
    title: "",
    amount: "",
    date: null,
    category: "",
    description: "",
  });

  const { title, amount, date, category, description } = inputState;

  const handleInput =
    (name: keyof IncomeInputState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setInputState({ ...inputState, [name]: e.target.value });
      setError(null);
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addIncome({
      title,
      amount: Number(amount),
      date: date ? date.toISOString() : "",
      category,
      description,
      // ❌ không truyền type nữa, backend sẽ tự gán
    });
    setInputState({
      title: "",
      amount: "",
      date: null,
      category: "",
      description: "",
    });
  };

  return (
    <IncomeStyled onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        value={title}
        name="title"
        placeholder="Income Title"
        onChange={handleInput("title")}
      />
      <input
        type="text"
        value={amount}
        name="amount"
        placeholder="Income Amount"
        onChange={handleInput("amount")}
      />
      <DatePicker
        id="date"
        placeholderText="Enter A Date"
        selected={date}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => setInputState({ ...inputState, date })}
      />
      <select required value={category} onChange={handleInput("category")}>
        <option value="" disabled>
          Select Option
        </option>
        <option value="salary">Salary</option>
        <option value="freelancing">Freelancing</option>
        <option value="investments">Investments</option>
        <option value="stocks">Stocks</option>
        <option value="bitcoin">Bitcoin</option>
        <option value="bank">Bank Transfer</option>
        <option value="youtube">YouTube</option>
        <option value="other">Other</option>
      </select>
      <textarea
        name="description"
        value={description}
        placeholder="Add A Reference"
        onChange={handleInput("description")}
      />
      <div className="submit-btn">
        <Button
          name="Add Income"
          icon={plus}
          bPad="1rem"
          bRad="8px"
          bg="var(--color-accent)"
          color="white"
          hColor="var(--color-green)"
          onClick={() => {}}
        />
      </div>
    </IncomeStyled>
  );
};

const IncomeStyled = styled.form`
    display: flex;
    overflow: auto;
    .total-income{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .income-content{
        display: flex;
        gap: 2rem;
        .incomes{
            flex: 1;
        }
    }
`;


export default Income;