import React from 'react';

export default function AboutMe() {
  return (
    <section className="w-2/3 rounded bg-white p-8 shadow">
      <h3 className="text-xl text-center">Timothy J White</h3>
      <h4 className="mt-1 text-sm text-center">
        <a className="text-blue-600" href="mailto:timma.j.white@gmail.com">
          timma.j.white@gmail.com
        </a>{' '}
      </h4>
      <p className="mt-2">
        A little about me - I got my start as a full stack web application
        developer building C#/.NET applications running on IIS servers at an
        on-premises data center at IHS Markit. As the web world evolved, I was
        an active member in helping move the existing stack from server-side
        driven apps, to front end SPAs using angular and a node/express backend
        RESTFUL APIs. I was also a part of a data center migration moving our
        infrastructure from bare metal servers to the cloud.
      </p>
      <p className="mt-2">
        My greatest strength on the front end is probably with Vue.js, but I
        have built applications with both Angular and React, with this site
        poweblue with React. I am very familiar with RESTful architecture, and
        have experience building out graphql schema as well.
      </p>
      <p className="mt-2">
        For backend experience, although my roots are in .NET, I much prefer to
        work with Node.js or Go to build out the API architecture. The ideal
        stack to me would utilize a federated graphql schema (one entry point
        for the organization) which serves to route requests to microservies,
        built based on domain driven design.
      </p>
      <p className="mt-2">
        Along with componentry, I am familiar with modern build tools including
        Webpack, Gulp, and Grunt. I have strong CSS, LESS, and SASS skills as
        well, recently using TailwindCSS, Bulma, and Bootstrap styling
        libraries.
      </p>
      <p className="mt-2">
        My career has continued to evolve into the devops world, building out
        and optimizing pipelines using IaC utilities such as CloudFormation and
        Terraform, along with automating normal developer workflows. Much of
        this culminated in the time I spent working on mastering the majority of
        the AWS services, recently completing my AWS Certified Solutions
        Architecture exam and obtaining certification.
      </p>
      <p className="mt-2">
        Along with my cloud and developer work, I have experience building and
        maintaining a kubernetes cluster and deploying using helm charts. I
        recently optimized our clusters to take advantage of autoscaling and
        spot instances for large cost savings.
      </p>
      <p className="mt-2">
        In terms of teamwork, I have been working on agile teams (mostly scrum)
        for the last 5 years, and have done several formal agile trainings.
        Understanding the importance of flexibility and change in the
        engineering process is critical in ensuring the product evolves with
        stake holder needs.
      </p>
      <p className="mt-2">
        Please take a look at my{' '}
        <a className="text-blue-600" href="https://github.com/cecotw">
          github account
        </a>{' '}
        with a direct link to this repository located{' '}
        <a
          className="text-blue-600"
          href="https://github.com/cecotw/react-pokedex-challenge"
        >
          here
        </a>
        .
      </p>
    </section>
  );
}
