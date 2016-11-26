export PERSONAL_WEBSITE_EMAIL_ADDRESS='nycdaamswdi@gmail.com'
export EMAIL_PASSWORD_Blog_App='nycdarocks'

alias dev="cd /Users/zahra120/dev"

parse_git_branch() {
  git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\ ->\ \1/'
}
export PS1='\e[1;32m\]\u\[\e[1;37m\]: \[\e[1;36m\]\w\[\e[1;33m\]$(parse_git_branch)\[\e[1;37m\] \[\e[0m\]'

