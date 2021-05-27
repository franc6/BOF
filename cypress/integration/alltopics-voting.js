describe('In the Voting stage', function() {
  const navfooter = require('../support/navfooter.js')
  const resetDB = require('../support/reset_database.js')
  const topics = require('../support/topics.js')
  describe('the All topics page for an admin user', function() {
    before(() => {
      resetDB.resetVoting()
      cy.typeLogin({username: 'admin', password: 'secret'})
    })

    it('loads successfully', function() {
      cy.visit('/topics')
    })

    it('has a logo', function() {
      cy.get('img.logo')
    })

    it('displays the correct topic information and notice', function() {
      topics.checkTopics(true, [], [], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    })

    navfooter.check('voting', true)
  })

  describe('the All topics page for a non-admin user', function() {
    before(() => {
      resetDB.resetVoting()
      cy.createUser({username: 'user1', password: 'pwd1'})
      cy.typeLogin({username: 'user1', password: 'pwd1'})
    })

    beforeEach(() => {
      Cypress.Cookies.preserveOnce('authtoken')
    })

    it('loads successfully', function() {
      cy.visit('/topics')
    })

    it('has a logo', function() {
      cy.get('img.logo')
    })

    it('displays the correct topic information and notice', function() {
      topics.checkTopics(true, [], [], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    })

    navfooter.check('voting', false)

    describe('Clicking the facilitate button', function() {
      it('adds a full vote for topic1 and sets facilitator', function() {
        cy.contains('h1', 'topic1').parent().children('form').children('input.facilitation__btn').click().then(() => {
          topics.checkTopics(true, [1], [], ['', 'user1', '', '', '', '', '', '', '', '', '', '', '', '', ''])
        })
      })

      it('adds a quarter vote for Prep BoF topic, and sets facilitator', function() {
        cy.contains('h1', 'Prep Team').parent().children('form').children('input.facilitation__btn').click().then(() => {
          topics.checkTopics(true, [1], [0], ['user1', 'user1', '', '', '', '', '', '', '', '', '', '', '', '', ''])
        })
      })
    })

    describe('Clicking the full vote button', function() {
      before(() => {
        resetDB.resetVoting()
      })

      beforeEach(() => {
        Cypress.Cookies.preserveOnce('authtoken')
      })

      it('adds a full vote for topic1 and does not set facilitator', function() {
        cy.contains('h1', 'topic2').parent().parent().children('div.topic__vote').children('form.fullvote').children('input[type=submit]').click().then(() => {
          topics.checkTopics(true, [2], [], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
        })
      })

      it('adds a quarter vote for Prep Team and does not set facilitator', function() {
        cy.contains('h1', 'Prep Team').parent().parent().children('div.topic__vote').children('form.fullvote').children('input[type=submit]').click().then(() => {
          topics.checkTopics(true, [2], [0], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
        })
      })
    })
  })

  describe('Multiple votes', function() {
    before(() => {
      resetDB.resetVoting()
    })

    beforeEach(() => {
      Cypress.Cookies.preserveOnce('authtoken')
    })

    it('allows only 3 full votes', function() {
      cy.contains('h1', 'topic1').parent().parent().children('div.topic__vote').children('form.fullvote').children('input[type=submit]').click().then(() => {

        cy.contains('h1', 'topic2').parent().parent().children('div.topic__vote').children('form.fullvote').children('input[type=submit]').click().then(() => {

          cy.contains('h1', 'topic3').parent().parent().children('div.topic__vote').children('form.fullvote').children('input[type=submit]').click().then(() => {
            topics.checkTopics(true, [1, 2, 3], [], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
          })
        })
      })
    })

    it('allows switching a full vote to a quarter vote', function() {
      cy.contains('h1', 'topic2').parent().parent().children('div.topic__vote').children('form.quartervote').children('input[type=submit]').click().then(() => {
        topics.checkTopics(true, [1, 3], [2], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
      })
    })
  })

})