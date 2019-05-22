Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: '#app',
    data: {
        min: 1,
        max: '',
        number: '',
        current: {
            title: '',
            img: '',
            alt: ''
        },
        loading: true,
        addedName: '',
        addedComment: '',
        comments: {},
        ratings: {}
    },
    created() {
        this.xkcd();
    },
    methods: {
        async xkcd() {
            console.log("fetching number " + this.number);
            try{
                this.loading = true;

                const response = await axios.get('https://xkcd.now.sh/' + this.number);
                console.log(response);

                this.current = response.data;
                this.number = response.data.num;

                this.loading = false;
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        },
        firstComic() {
            this.number = this.min;
        },
        previousComic() {
            if (this.number <= this.min) {
                this.number = this.min;
                return;
            }
            const shift = (this.number === 405) ? 2 : 1;
            this.number = this.number - shift;
        },
        nextComic() {
            if (this.number >= this.max) {
                this.number = this.max;
                return;
            }
            const shift = (this.number === 403) ? 2 : 1;
            this.number = this.number + shift;
        },
        lastComic() {
            this.number = this.max;
        },
        getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
        },
        randomComic() {
            this.number = this.getRandom(1, this.max);
        },
        addComment() {
            if (!(this.number in this.comments)) {
                Vue.set(app.comments, this.number, new Array);
            }

            this.comments[this.number].push({
                author: this.addedName,
                text: this.addedComment,
                time: moment().format('LLLL')

            });
            this.addedName = '';
            this.addedComment = '';
        },
        setRating(rating){
            // Handle the rating
            if (!(this.number in this.ratings))
                Vue.set(this.ratings, this.number, {
                    sum: 0,
                    total: 0
            });
            this.ratings[this.number].sum += rating;
            this.ratings[this.number].total += 1;
        }      
    },
    computed: {
        month() {
            var month = new Array;
            if (this.current.month === undefined)
            return '';
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            return month[this.current.month - 1];
        }
    },
    watch: {
        number(value, oldvalue) {
            if (oldvalue === '') {
                this.max = value;
                console.log("set num_max to " + this.max)
                return;
            }

            this.xkcd();
        },
    },
});