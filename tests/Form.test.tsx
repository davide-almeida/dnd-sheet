import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../src/components/Form';
import type { LevelInfo } from '../src/types';
import raceData from '../data/raceData.json';
import classData from '../data/classData.json';
import levelData from '../data/levelData.json';

describe('Form', () => {
  it('renders correctly', () => {
    const raceNames: string[] = raceData.races.map(characterRace => characterRace.name);
    const classNames: string[] = classData.classes.map(characterClass => characterClass.name);

    render(<Form />);
    const nameInput: HTMLInputElement = screen.getByRole('textbox', { name: 'Nome' });
    const raceInput: HTMLInputElement = screen.getByRole('combobox', { name: 'Raça' });
    const raceOptions = within(raceInput).getAllByRole('option');
    const classInput: HTMLInputElement = screen.getByRole('combobox', { name: 'Classe' });
    const classOptions = within(classInput).getAllByRole('option');
    const xpInput: HTMLInputElement = screen.getByRole('spinbutton', { name: 'Experiência' });
    const levelDiv = screen.getByRole('region', { name: 'Nível' });

    expect(nameInput).toHaveAttribute('placeholder', 'Nome do personagem');
    for (const raceOption of raceOptions) {
      const optionValue = Number(raceOption.getAttribute('value'));
      const raceNameRegex = new RegExp(`^${raceNames[optionValue]}$`);
      expect(raceOption).toHaveTextContent(raceNameRegex);
    }
    for (const classOption of classOptions) {
      const optionValue = Number(classOption.getAttribute('value'));
      const classNameRegex = new RegExp(`^${classNames[optionValue]}$`);
      expect(classOption).toHaveTextContent(classNameRegex);
    }
    expect(xpInput).toHaveAttribute('min', '0');
    expect(levelDiv).toHaveTextContent(/^Nível 1$/);
  });

  it('increases level based on character experience', async () => {
    const levels: LevelInfo[] = levelData.levels;
    render(<Form />);
    const xpInput: HTMLInputElement = screen.getByRole('spinbutton', { name: 'Experiência' });
    const levelDiv = screen.getByRole('region', { name: 'Nível' });
    for (const levelInfo of levels) {
      const maxExperience = String(levelInfo.maxExperience);
      const level = String(levelInfo.level);
      const levelRegex = new RegExp(`^Nível ${level}$`);

      await userEvent.clear(xpInput);
      await userEvent.type(xpInput, maxExperience);

      expect(levelDiv).toHaveTextContent(levelRegex);
    }
  });

  it('shows level as 20 if experience value over 999.999 is set', async () => {
    render(<Form />);
    const xpInput: HTMLInputElement = screen.getByRole('spinbutton', { name: 'Experiência' });
    const levelDiv = screen.getByRole('region', { name: 'Nível' });

    await userEvent.type(xpInput, '1000000');

    expect(levelDiv).toHaveTextContent(/^Nível 20$/);
  });

  it('saves character data to local storage', async () => {
    render(<Form />);
    const nameInput: HTMLInputElement = screen.getByRole('textbox', { name: 'Nome' });
    const raceInput: HTMLInputElement = screen.getByRole('combobox', { name: 'Raça' });
    const dwarfId = '0';
    const classInput: HTMLInputElement = screen.getByRole('combobox', { name: 'Classe' });
    const fighterId = '7';
    const xpInput: HTMLInputElement = screen.getByRole('spinbutton', { name: 'Experiência' });
    // const saveButton: HTMLButtonElement = screen.getByRole('button', { name: 'Salvar' });

    await userEvent.type(nameInput, 'José da Silva');
    await userEvent.selectOptions(raceInput, within(raceInput).getByRole('option', { name: 'Anão' }));
    await userEvent.selectOptions(classInput, within(classInput).getByRole('option', { name: 'Guerreiro' }));
    await userEvent.type(xpInput, '300');
    // userEvent.click(saveButton);

    const storedData = JSON.parse(localStorage.characterData);
    const expectedData = {
      'name': 'José da Silva',
      'race': dwarfId,
      'class': fighterId,
      'experience': '300',
    };
    expect(storedData).toEqual(expectedData);
  });
});
