[![Travis Status](https://travis-ci.org/SanaMobile/sana.protocol_builder.svg?branch=master)](https://travis-ci.org/SanaMobile/sana.protocol_builder) [![Requirements Status](https://requires.io/github/SanaMobile/sana.protocol_builder/requirements.svg?branch=master)](https://requires.io/github/SanaMobile/sana.protocol_builder/requirements/?branch=master)

About This Project
===

The Sana Protocol is an XML specification for defining medical procedures. Basically, Sana is to HTML as medical documents are to web pages. These Sana procedures are downloaded by nurses and doctors onto their phones with the Sana mobile application. These mobile applications will then parse the Sana document and generate a questionaire "procedure" that the nurse or doctor can ask their patients. An example document is shown below:

```
<Procedure title="Neuro Module" author="Partners For Care">
  <Page>
    <Element type="MULTI_SELECT" id="1" 
      concept="NEURO SYMPTOM" 
      question="What are the symptoms?" 
      answer=""
      choices=“Dizziness,Fainting,Headaches,Other complaints"/>
  </Page>
  <Page>
		<ShowIf>
			<Criteria type="EQUALS" id="1" value="Fainting"/>
		</ShowIf>
		<Element type="ENTRY" 
		concept="UNCONSCIOUSNESS" id="2" 
		question="How long was the patient unconscious?" 
		answer=""/>
  </Page>
  <Page>
		<ShowIf>
			<Criteria type="EQUALS" id="1" value="Other complaints"/>
		</ShowIf>
		<Element type="ENTRY" 
		concept="OTHER COMPLAINTS" id="4" 
		question="Are there any other complaints?"
		answer=""/>
  </Page>
  ...
</Procedure>
```

However, these XML documents are difficult to write for non-technical users. The purpose of this project is to provide a easy-to-use web interface to aid doctors and other non-technical users in creating these documents. In other words, this is a WYSIWYM (what you see is what you mean) editor for Sana documents.

See our [wiki](https://github.com/SanaMobile/sana.protocol_builder/wiki) for more information about this project.
