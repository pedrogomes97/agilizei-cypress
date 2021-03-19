/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

context('Dev Finances Agilizei', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/#', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        });
    });
    
    it('Cadastrar entradas', () => {

        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type('Mesada'); //id
        cy.get('[name=amount]').type(12); //atributos
        cy.get('[type=date]').type('2021-03-21'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor
        
        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    it('Cadastrar saídas', () => {
        
        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type('Mesada'); //id
        cy.get('[name=amount]').type(-12); //atributos
        cy.get('[type=date]').type('2021-03-21'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor
        
        cy.get('#data-table tbody tr').should('have.length', 3);
        
    });

    it('Remover entradas e saídas', () => {

        //estratégia 1
        cy.get('td.description')
        .contains("Mesada")
        .parent()
        .find('img[onclick*=remove]')
        .click()

        //estratégia 2
        cy.get('td.description')
        .contains('Suco Kapo')
        .siblings()
        .children('img[onclick*=remove]')
        .click()

        cy.get('#data-table tbody tr').should('have.length', 0);
    });

    it('Validar saldo com diversas transações', () => {

        //capturar as linhas com transações
        //capturar o texto das transações
        //formatar valores das linhas

        //capturar o texto do total
        //comparar o somatório

        let incomes = 0
        let expenses = 0 

        cy.get('#data-table tbody tr')
        .each(($el, index, $list) => {
            
            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {

                if(text.includes('-')){
                    expenses = expenses + format(text)
                } else {
                    incomes = incomes + format(text)
                }

                cy.log('entradas',incomes)
                cy.log('saidas', expenses)

            })

        })

        cy.get('#totalDisplay').invoke('text').then(text => {
            cy.log('Valor total',format(text))

            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)

        });

    });
});