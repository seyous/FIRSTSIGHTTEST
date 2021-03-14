

describe("login test", function () {
  it("sign in", function () {
    cy.visit('/login') // baseUrl is prepended to url
    cy.get('.card-body').within(() => { //Query the element
      cy.get('input[type = "email"]').should('have.attr', 'placeholder', 'Email Address')// assert the email placeholder 
      cy.get('input[type = "password"]').should('have.attr', 'placeholder', 'Password')//assert the password placeholder 
    })
    cy.get('input[type = "email"]').type('quality.assurance.challenge@foureyesinsight.com')
    cy.get('input[type = "password"]').type('yWcV%9MBS7w(.8,MLE&S')
    cy.get('.btn').contains('Login').click() 
    cy.location('pathname').should('eq', '/home')//check if the user is redirected to home
    cy.title().should('eql', 'Analytics Dashboard - Four Eyes Insight')//assert the title of the page
    cy.server()
    cy.route('/login').as('sites')//check for the route 
    cy.visit('/login')
    cy.clearLocalStorage()

  })

//intercept the login request
  it("intercept the login request", function () { 
      cy.intercept('POST',  (req) => {
      expect(req.status).to.eq(200)// check if the status code is 200
      expect(req.body).to.have.property('sites')//check if the property contain sites
      expect(req.body).to.have.property.id('30')//check for the id
    })

  })

//create an initial log in request
  it("request to log in", function () {
    cy.request({
      method: 'POST',// Post reuest to log in
      url: '/login', // baseUrl is prepended to url
      form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
      followRedirect: false, // turn off following redirects
      failOnStatusCode: false,
      body: {
        username: 'quality.assurance.challenge@foureyesinsight.com',
        password: 'yWcV%9MBS7w(.8,MLE&S'
      }
    })
  })

  it("request to log out", function () {
    cy.get('.menu').contains('Sign Out').click()//log out of the site
    cy.request('/login')//send a request to log out
      .should((response) => {
        expect(response.status).to.eq(204)//check for status code 204
      })

  })
})

