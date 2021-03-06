# Link shortener microservice

This is an example of a link shortening microservice.  
It uses an express app deployed on AWS Elastic Beanstalk using Docker automated with Github Actions.

> Deployed on [http://eb1-env.eba-np965qgi.us-east-2.elasticbeanstalk.com/](http://eb1-env.eba-np965qgi.us-east-2.elasticbeanstalk.com/)

![System architecture](https://github.com/tusharpandey13/node-elastic-beanstalk/raw/master/src/public/system.jpg 'System architecture')

### Features

- Made using NodeJS and ExpressJS
- It uses MongoDB as document store
- It uses redis as caching layer
- It is deployed automatically on [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) using [Github Actions CI/CD](https://github.com/features/actions)
- Docker is used for containerization of deploy packages
- An api is also exposed for the same. The API documentation can be found [here](https://documenter.getpostman.com/view/9368565/TzkyNLWL)

### References:

- [beanstalk-deploy](https://github.com/einaregilsson/beanstalk-deploy)
- [Deploy using Github Actions on AWS Elastic BeanStalk](https://javascript.plainenglish.io/deploy-using-github-actions-on-aws-elastic-beanstalk-c23ecd35776d)
- [Deploying a Docker Container with AWS Elastic Beanstalk](https://medium.com/@sommershurbaji/deploying-a-docker-container-to-aws-with-elastic-beanstalk-28adfd6e7e95)
- [Continuous Delivery with AWS Elastic Beanstalk](https://medium.com/@sommershurbaji/continuous-delivery-with-aws-elastic-beanstalk-and-travis-ci-2dd54754965f)

### Major Dependencies

- [express](https://www.npmjs.com/package/express)
- [eta](https://www.npmjs.com/package/eta)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [nanoid](https://www.npmjs.com/package/nanoid)
