const neo4jSession = require('../neo4'); // Adjust the path based on your directory structure

const submitContactForm = async (formData) => {
  try {
    // Extract individual properties from formData
    const { firstName, lastName, email, phoneNumber, address } = formData;

    // Run the Cypher query
    const result = await neo4jSession.run(
      'CREATE (c:Contact { firstName: $firstName, lastName: $lastName, email: $email, phoneNumber: $phoneNumber, address: $address }) RETURN c',
      { firstName, lastName, email, phoneNumber, address }
    );

    // Extract and return the properties of the created contact form
    const createdContactForm = result.records[0].get('c').properties;
    return createdContactForm;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error; // Re-throw the error for the calling code to handle
  }
};



// contactFormService.js

const getAllContacts = async () => {
    const query = `
      MATCH (c:Contact)
      RETURN c
    `;
  
    const result = await neo4jSession.run(query);
    return result.records.map((record) => record.get('c').properties);
  };
  

  
  

module.exports = { submitContactForm,getAllContacts };

