FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code/server
COPY requirements.txt /code/server
RUN pip install -r requirements.txt
EXPOSE 8080