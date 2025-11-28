import React, { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/useGlobalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

type ExpenseInputState = {
  title: string;
  amount: string;
  date: Date | null;
  category: string;
  description: string;
};

function ExpenseForm() {
  const { addExpense, error, setError } = useGlobalContext();

  const [inputState, setInputState] = useState<ExpenseInputState>({
    title: '',
    amount: '',
    date: null,
    category: '',
    description: '',
  });

  const { title, amount, date, category, description } = inputState;

  const handleInput =
    (name: keyof ExpenseInputState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setInputState({ ...inputState, [name]: e.target.value });
      setError(null);
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addExpense({
      title,
      amount: Number(amount),
      date: date ? date.toISOString() : '',
      category,
      description,
    });
    setInputState({
      title: '',
      amount: '',
      date: null,
      category: '',
      description: '',
    });
  };

  return (
    <ExpenseFormStyled onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <div className="input-control">
        <input
          type="text"
          value={title}
          placeholder="Expense Title"
          onChange={handleInput('title')}
        />
      </div>

      <div className="input-control">
        <input
          type="text"
          value={amount}
          placeholder="Expense Amount"
          onChange={handleInput('amount')}
        />
      </div>

      <div className="input-control">
        <DatePicker
          id="date"
          placeholderText="Enter A Date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(selectedDate: Date | null) =>
            setInputState({ ...inputState, date: selectedDate })
          }
        />
      </div>

      <div className="selects input-control">
        <select
          required
          value={category}
          onChange={handleInput('category')}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="education">Education</option>
          <option value="groceries">Groceries</option>
          <option value="health">Health</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="takeaways">Takeaways</option>
          <option value="clothing">Clothing</option>
          <option value="travelling">Travelling</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="input-control">
        <textarea
          value={description}
          placeholder="Add A Reference"
          cols={30}
          rows={4}
          onChange={handleInput('description')}
        ></textarea>
      </div>

      <div className="submit-btn">
        <Button
          name="Add Expense"
          icon={plus}
          bPad=".8rem 1.6rem"
          bRad="30px"
          bg="var(--color-accent)"
          color="#fff"
        />
      </div>
    </ExpenseFormStyled>
  );
}

const ExpenseFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid #ffffffff;
    background: transparent;
    resize: none;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);

    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }
  }

  .input-control input {
    width: 100%;
  }

  .selects {
    display: flex;
    justify-content: flex-end;

    select {
      color: rgba(34, 34, 96, 0.4);

      &:focus,
      &:active {
        color: rgba(34, 34, 96, 1);
      }
    }
  }

  .submit-btn button {
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

    &:hover {
      background: var(--color-green) !important;
    }
  }
`;

export default ExpenseForm;
